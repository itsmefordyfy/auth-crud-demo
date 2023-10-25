import {
  View as NativeView,
  Text as NativeText,
  TextStyle,
  Platform,
  Linking
} from "react-native";
import { StyledProps, styled } from "nativewind";
import { ComponentProps, forwardRef } from "react";
import { TextLink as SolitoTextLink } from "solito/link";

export const Row = styled(NativeView, "flex-row");

export const View = styled(NativeView);

export const P = styled(NativeText, "text-base text-black my-4");


export const H1 = styled(NativeText, "text-3xl font-extrabold my-4");
export const H2 = styled(NativeText, "text-2xl font-extrabold my-3");
export const H3 = styled(NativeText, "text-xl font-extrabold my-2");
export const H4 = styled(NativeText, "text-lg font-extrabold my-2");
export const H5 = styled(NativeText, "text-base font-extrabold my-2");
export const H6 = styled(NativeText, "text-sm font-extrabold my-1");


H1.defaultProps = {
  accessibilityLevel: 1,
  accessibilityRole: "header",
};

H2.defaultProps = {
  accessibilityLevel: 1,
  accessibilityRole: "header",
};

H3.defaultProps = {
  accessibilityLevel: 1,
  accessibilityRole: "header",
};

H4.defaultProps = {
  accessibilityLevel: 1,
  accessibilityRole: "header",
};

H5.defaultProps = {
  accessibilityLevel: 1,
  accessibilityRole: "header",
};

H6.defaultProps = {
  accessibilityLevel: 1,
  accessibilityRole: "header",
};

export interface AProps extends ComponentProps<typeof NativeText> {
  href?: string
  target?: "_blank"
}

export const A = forwardRef<NativeText, StyledProps<AProps>>(function A(
  { className = "", href, target, ...props },
  ref
) {
  const nativeAProps = Platform.select<Partial<AProps>>({
    web: {
      href,
      target,
      hrefAttrs: {
        rel: "noreferrer",
        target,
      },
    },
    default: {
      onPress: (event) => {
        props.onPress && props.onPress(event);
        if (Platform.OS !== "web" && href !== undefined) {
          Linking.openURL(href);
        }
      },
    },
  });

  return (
    <NativeText
      accessibilityRole="link"
      className={`text-blue-500 hover:underline ${className}`}
      {...props}
      {...nativeAProps}
      ref={ref}
    />
  );
});

export const TextLink = styled<
  ComponentProps<typeof SolitoTextLink> & { style?: TextStyle }
>(function TextLink({ style, textProps, ...props }) {
  return (
    <SolitoTextLink
      textProps={{ ...textProps, style: [style, textProps?.style] }}
      {...props}
    />
  );
}, "hover:underline text-amber-600");

export { ViewProps } from "react-native";
