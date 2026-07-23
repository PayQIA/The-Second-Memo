import React from "react";

export const Logo = ({
	className,
	id,
}: {
	className?: string
	id?: string
}) => {
	return (
		<img
			src="/images/logo.png"
			alt="The Second Memo Logo"
			className={className}
			id={id}
			style={{ objectFit: "contain" }}
		/>
	)
}

export const LogoFull = ({
	className,
	id,
}: {
	className?: string
	id?: string
}) => {
	return (
		<img
			src="/images/logo.png"
			alt="The Second Memo Logo"
			className={className}
			id={id}
			style={{ objectFit: "contain" }}
		/>
	)
}

export const GradientLogo = ({ className = "" }: { className?: string }) => {
	return (
		<img
			src="/images/logo.png"
			alt="The Second Memo Logo"
			className={className}
			style={{ objectFit: "contain" }}
		/>
	)
}
