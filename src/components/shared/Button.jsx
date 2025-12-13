import { Button } from "antd";

const CustomButton = ({ className = "", ...props }) => {
  return (
    <Button
      {...props}
      className={`bg-[#006C93]! text-white! hover:bg-[#005877]! ${className}`}
    />
  );
};

export default CustomButton;
