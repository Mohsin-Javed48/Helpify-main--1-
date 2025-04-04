export default function BookButton({
  text,
  onClick,
  variant = "primary",
  additionalClasses = "",
}) {
  // Base styles
  const baseStyles =
    "text-center font-medium not-italic mt-6  text-[12px] sm:text-[15px] md:text-[18px] lg:text-[24px] leading-[36px] tracking-[-0.24px] px-[25px] py-[10px] sm:px-[40px] sm:py-[15px] md:px-[50px] md:py-[18px] lg:px-[60px] lg:py-[22px]  leading-[26px] tracking-[-0.15px] rounded-md shadow-md transition duration-200";

  // Style variants
  const variants = {
    primary:
      "bg-[#2937B1] text-[#ffff] border border-[#2937B1] hover:bg-[#ffff] hover:text-[#2937B1]",
    secondary:
      "text-[#2937B1] bg-[#F4F4F4] border border-[#2937B1] hover:bg-[#2937B1] hover:text-[#ffff]",
    outline:
      "text-[#2937B1] border border-[#2937B1] bg-[#ffff] hover:bg-[#2937B1] hover:text-[#ffff]",
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
