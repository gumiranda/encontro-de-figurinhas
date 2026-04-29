"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { QRCode } from "@workspace/ui/components/kibo-ui/qr-code";

type Props = {
  url: string;
};

export function ProfileQRCode({ url }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">QR Code do perfil</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center">
        <div className="w-48 h-48 p-4 bg-white rounded-lg">
          <QRCode data={url} foreground="#1a472a" background="#ffffff" robustness="M" />
        </div>
      </CardContent>
    </Card>
  );
}
