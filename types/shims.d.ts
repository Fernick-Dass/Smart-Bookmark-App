declare module "react";
declare module "react/jsx-runtime";
declare module "@supabase/supabase-js";

declare var process: {
  env: {
    [key: string]: string | undefined;
  };
};

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}


