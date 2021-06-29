import React from "react";
import placeholderImage from "../../assets/placeholder-image.png";

const ImageInput = ({ image, handleImageUpload, handleImageReset }) => {
   return (
      <label className="img-label-container" key={image.order}>
         <img className="img-label" src={image.imageDisplay} alt="" />
         <input type="file" accept="image/*" key={image.inputKey} onChange={(e) => handleImageUpload(e, image.order)} />
         <button className="img-reset-btn" type="button" onClick={() => handleImageReset(image.order)}>
            x
         </button>
         {(image.imageDisplay !== placeholderImage && <pre className="image-edit-txt"> Edit </pre>) || <pre className="image-edit-txt"> Add </pre>}
      </label>
   );
};

export default ImageInput;
