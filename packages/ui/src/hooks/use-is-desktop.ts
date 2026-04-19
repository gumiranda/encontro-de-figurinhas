import * as React from "react";

const DESKTOP_BREAKPOINT = 1024;

/**
 * Retorna `undefined` antes da hidratação para que callers possam exibir um
 * placeholder e evitar flash de layout errado, depois `true`/`false` conforme
 * `(min-width: 1024px)`.
 */
export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = React.useState<boolean | undefined>(
    undefined,
  );

  React.useEffect(() => {
    const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const onChange = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    onChange();
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return isDesktop;
}
