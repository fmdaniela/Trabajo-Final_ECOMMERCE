import { Groq } from "groq-sdk";
import dotenv from "dotenv";
import Producto from "../models/Producto.js";
import Categoria from "../models/Categoria.js";
import VarianteProducto from "../models/VarianteProducto.js";

dotenv.config();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = `
Eres un asistente virtual de la tienda Vitalia, venta de ropa deportiva femenina.
Ayudas a los clientes a elegir productos y responder dudas de manera amable y clara.
Usa un tono cercano y profesional.
No saludes al inicio de cada respuesta; solo da la respuesta concreta.
Responde de forma concisa y exacta usando la información de la tienda.
Si no conoces la respuesta de la tienda, di que no puedes ayudar.
`;

export const chatQuery = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, error: "Falta el mensaje del usuario" });

    // Traer categorías activas
    const categorias = await Categoria.findAll({ where: { activa: true } });
    const categoriasInfo = categorias.map(c => c.nombre).join(", ");

    // Productos con variantes
    const productos = await Producto.findAll({
      include: [
        { model: Categoria, as: "categoria" },
        { model: VarianteProducto, as: "variantes" }
      ],
      order: [["id", "DESC"]],
      limit: 5,
    });

    const productosInfo = productos.map(p => {
      const colores = [...new Set(p.variantes.map(v => v.color))].join(", ");
      const tallas = [...new Set(p.variantes.map(v => v.talla))].join(", ");
      return `- ${p.nombre} (${p.categoria?.nombre || "sin categoría"}): $${p.precio}${p.oferta ? ", en oferta" : ""}, colores: ${colores}, tallas: ${tallas}`;
    }).join("\n");

    const userPrompt = `
Mensaje del usuario: ${message}

Información de la tienda:
- Categorías activas: ${categoriasInfo}
- Productos: 
${productosInfo}
- Medios de pago: Transferencia: 10% OFF, Débito: 5% OFF, tarjetas Visa, Mastercard, Amex y Cabal.
- Local y horarios: Lunes a Viernes 9:00-13 / 17:00-21, Sábados 9:00-14, Av. Belgrano 344, Alta Gracia, Córdoba.
- Compras al por mayor: Sí, enviar mail a info@vitalia.com
- Envíos a todo el paìs: Gratis a partir de $50.000, sino $5.000.
- Compra mínima: $25000
- Demoras de envío: Más de 500 ks 3 días hábiles, sino 1 día.

Instrucciones:
- Solo responde con información disponible de la tienda.
- Sé conciso y claro.
- Para productos, muestra colores y talles, y si preguntan stock derivar a la ficha del producto.
- Si la consulta no tiene relación con la tienda, responde: "Lo siento, no puedo ayudarte con eso, solo tengo información de Vitalia."
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_completion_tokens: 200,
    });

    const reply = completion.choices[0]?.message?.content?.trim() || "No pude generar una respuesta.";
    res.json({ success: true, reply });

  } catch (error) {
    console.error("Error en chatbot:", error);
    res.status(500).json({ success: false, error: "Error interno del servidor" });
  }
};



