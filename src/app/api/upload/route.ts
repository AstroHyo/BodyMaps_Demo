import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (
        pathname: string,
        clientPayload?: string | null
      ) => {
        // Generate a client token for the browser to upload the file

        // ⚠️ Authenticate users before generating the token.
        // Otherwise, you're allowing anonymous uploads.

        const { password } = JSON.parse(clientPayload || "{}");
        if (!password) {
          throw new Error("Password is required");
        }

        // Validate password (replace with your actual password check)
        if (password !== process.env.PASSWORD) {
          throw new Error("Invalid password");
        }

        return {
          maximumSizeInBytes: 20 * 1024 * 1024, // 20MB
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        console.log("blob upload completed", blob, tokenPayload);

        // try {
        //   // Run any logic after the file upload completed
        //   // const { userId } = JSON.parse(tokenPayload);
        //   // await db.update({ avatar: blob.url, userId });
        // } catch (error) {
        //   throw new Error('Could not update user');
        // }
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message });
  }
}
