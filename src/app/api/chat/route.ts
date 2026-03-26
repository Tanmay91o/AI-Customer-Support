import ConnectDb from "@/lib/db";
import Settings from "@/model/setting.model";
import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { message, ownerId } = await req.json()
        if (!message || !ownerId) {
            return NextResponse.json(
                { message: "message and owner id is required" },
                { status: 400 }
            )
        }

        await ConnectDb()

        const setting = await Settings.findOne({ ownerId })
        if (!setting) {
            return NextResponse.json(
                { message: "Chat Bot is not configered yet." },
                { status: 400 }
            )
        }
        const KNOWLEDGE = `
        business name - ${setting.businessName || "not provided"}
        support email - ${setting.supportEmail || "not provided"}
        knowledge - ${setting.knowledge || "not provided"}
        `
        const prompt = `
If the customer's question is completely unrelated to the information,
or cannot be reasonably answered from it, reply exactly with:
"Please contact support."

BUSINESS INFORMATION

${KNOWLEDGE}

CUSTOMER QUESTION

${message}

ANSWER`;

        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const res = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: "Explain how AI works in a few words",
        });

        const response = NextResponse.json(res.text)
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Method", "POST,OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");
        return response

    } catch (error) {
        const response = NextResponse.json(
            { message: `chat error ${error}` },
            { status: 500 }
        )
        response.headers.set("Access-Control-Allow-Origin", "*");
        response.headers.set("Access-Control-Allow-Method", "POST,OPTIONS");
        response.headers.set("Access-Control-Allow-Headers", "Content-Type");
        return response
    }
}
export const OPTIONS = async () => {
    return NextResponse.json(null, {
        status: 201,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Method": "POST,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
        }
    })
}