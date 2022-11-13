import { Helmet } from "react-helmet";
const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: " Welcome to StoreHook",
  description: "We sell top notch products for a reasonable price",
  keywords: "electronics, phones, consoles",
};

export default Meta;
