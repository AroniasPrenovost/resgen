import { NextResponse } from "next/server";
import mammoth from "mammoth";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return new NextResponse("No file provided", { status: 400 });
    }

    const fileType = file.type;
    let extractedText = "";

    if (
      fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      fileType === "application/msword"
    ) {
      // Process .docx files
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      extractedText = result.value;
    } else if (fileType === "text/plain") {
      // Process .txt files
      extractedText = await file.text();
    } else {
      return new NextResponse("Unsupported file format", { status: 400 });
    }

    return NextResponse.json({
      success: true,
      text: extractedText,
      filename: file.name
    });
  } catch (error) {
    console.error("[PROCESS_FILE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
