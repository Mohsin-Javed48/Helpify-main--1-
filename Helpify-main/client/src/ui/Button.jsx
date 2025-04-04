export default function Button({
  text,
  onClick,
  variant = "primary",
  additionalClasses = "",
}) {
  const baseStyles =
    "text-center font-medium text-[15px] leading-[26px] tracking-[-0.15px] px-[24px] py-[14px] rounded-[23px] transition duration-200";

  const variants = {
    primary:
      "bg-[#2937B1] text-[#ffff] border border-[rgba(20,20,20,0.5)] hover:bg-[#1e2a99]",
    secondary: "border border-[rgba(20,20,20,0.5)] hover:bg-gray-100",
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${additionalClasses}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}
