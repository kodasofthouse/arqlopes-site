"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;

    if (!name || !email || !phone) {
        return {
            success: false,
            message: "Todos os campos são obrigatórios.",
        };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            success: false,
            message: "Por favor, insira um e-mail válido.",
        };
    }

    try {
        await resend.emails.send({
            from: "delivered@resend.dev", // Replace with your verified domain
            to: ["email-teste-resend@gmail.com"], // Where you want to receive the emails
            subject: "Nova solicitação de orçamento - Site",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #a78f62; padding-bottom: 10px;">
            Nova Solicitação de Orçamento
          </h2>
          
          <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px;">
            <h3 style="color: #a78f62; margin-top: 0;">Dados do Cliente:</h3>
            
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone}</p>
          </div>
          
          <div style="background-color: #e8f4f8; padding: 15px; border-left: 4px solid #a78f62;">
            <p style="margin: 0; color: #666;">
              Esta mensagem foi enviada através do formulário de contato do site.
            </p>
          </div>
        </div>
      `,
            text: `
        Nova Solicitação de Orçamento
        
        Nome: ${name}
        E-mail: ${email}
        Telefone: ${phone}
        
        Esta mensagem foi enviada através do formulário de contato do site.
      `,
        });

        return {
            success: true,
            message:
                "Mensagem enviada com sucesso! Entraremos em contato em breve.",
        };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            success: false,
            message: "Erro ao enviar mensagem. Tente novamente mais tarde.",
        };
    }
}
