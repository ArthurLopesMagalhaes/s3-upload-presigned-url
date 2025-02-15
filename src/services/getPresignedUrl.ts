import axios from "axios";
const VITE_LAMBDA_FUNCTION_URL = import.meta.env.VITE_LAMBDA_FUNCTION_URL;

interface getPresignedUrlProps {
  signedUrl: string;
}

export async function getPresignedUrl(file: File) {
  const { data } = await axios.post<getPresignedUrlProps>(
    VITE_LAMBDA_FUNCTION_URL,
    {
      fileName: file.name,
    }
  );

  return data.signedUrl;
}
