import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./Card";
import React, { ReactNode } from "react";

const FeatureCard = ({SketchBox, Icon, title, description}: {SketchBox: ReactNode, Icon: ReactNode, title: string, description: string }) => {
  return (
    <Card className="border-2 border-dashed border-gray-600  bg-gray-800 transform transition duration-300 hover:-translate-y-2">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 relative">
          {SketchBox}
          {Icon}
        </div>
        <CardTitle className="font-mono text-white">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center font-mono text-gray-300">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default FeatureCard;
