import { ICapture, IComponentSpec, IDynamicText, IStaticImage } from "../interfaces";
import IPdfKitComponent from "./IPdfKitComponent";
import CaptureComponent from "./CaptureComponent";
import StaticImageComponent from "./StaticImageComponent";
import DynamicTextComponent from "./DynamicTextComponent";

export default function pdfKitComponentFactory(renderableSpec: IComponentSpec): IPdfKitComponent {
    if(renderableSpec["capture"] !== undefined) {
        const { destination, seriesIndex } = renderableSpec["capture"] as ICapture;
        return new CaptureComponent(destination, seriesIndex);
    } else if(renderableSpec["staticImage"] !== undefined) {
        const { destination, imagePath } = renderableSpec["staticImage"] as IStaticImage;
        return new StaticImageComponent(destination, imagePath);
    } else if(renderableSpec["dynamicText"] !== undefined) {
        const { destination, templateString, cssStyle } = renderableSpec["dynamicText"] as IDynamicText;
        return new DynamicTextComponent(destination, templateString, cssStyle);
    } else {
        throw new Error("Could not determine renderable kind from spec: " + JSON.stringify(renderableSpec));
    }
}