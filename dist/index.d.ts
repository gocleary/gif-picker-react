declare enum ContentFilter {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    OFF = "off"
}
declare enum Theme {
    LIGHT = "light",
    DARK = "dark",
    AUTO = "auto"
}
interface TenorImage {
    id: string;
    tenorUrl: string;
    shortTenorUrl: string;
    description: string;
    createdAt: Date;
    tags: string[];
    url: string;
    height: number;
    width: number;
    preview: TenorImagePreview;
}
interface TenorImagePreview {
    url: string;
    height: number;
    width: number;
}

interface GifPickerReactProps {
    tenorApiKey: string;
    onGifClick?: (gif: TenorImage) => void;
    autoFocusSearch?: boolean;
    contentFilter?: ContentFilter;
    initialSearchTerm?: string;
    clientKey?: string;
    country?: string;
    locale?: string;
    width?: number | string;
    height?: number | string;
    categoryHeight?: number | string;
    theme?: Theme;
}

interface GifPickerProps extends GifPickerReactProps {
}
declare function GifPicker(props: GifPickerProps): JSX.Element;

export { ContentFilter, GifPickerProps, TenorImage, Theme, GifPicker as default };
