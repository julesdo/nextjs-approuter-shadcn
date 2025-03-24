import { NextResponse } from "next/server"
import { Client } from "@notionhq/client"

const notion = new Client({ auth: process.env.NOTION_API_KEY })
const databaseId = process.env.NOTION_DATABASE_ID

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    const response = await notion.pages.create({
      parent: { database_id: databaseId as string },
      properties: {
        Name: {
          title: [
            {
              text: { content: email },
            },
          ],
        },
        Email: {
          email: email,
        },
        Type: {
          select: { name: "MAJ & Infos" },
        },
        Status: {
          select: { name: "New" },
        },
      },
    })

    return NextResponse.json({ message: "Success", data: response })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: "Erreur lors de l'enregistrement", error },
      { status: 500 }
    )
  }
}
