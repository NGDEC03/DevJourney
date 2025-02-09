import { Suspense } from "react";
import VerifyEmail, { VerifyingMessage } from "./VerifyEmailWrapper";

export default function Page(){
  return (
    <Suspense fallback={<VerifyingMessage/>}>
      <VerifyEmail></VerifyEmail>
    </Suspense>
  )
}