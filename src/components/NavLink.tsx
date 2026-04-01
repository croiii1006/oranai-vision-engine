import { Link, useLocation, type LinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<LinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName: _pending, to, ...props }, ref) => {
    const { pathname } = useLocation();
    const hrefStr = typeof to === "string" ? to : `${to.pathname ?? ""}`;
    const isActive =
      pathname === hrefStr ||
      (hrefStr !== "/" && hrefStr.length > 0 && pathname.startsWith(hrefStr));

    return (
      <Link
        ref={ref}
        to={to}
        className={cn(className, isActive && activeClassName)}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
