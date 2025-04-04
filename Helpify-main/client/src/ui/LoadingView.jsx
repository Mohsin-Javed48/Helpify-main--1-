import React from 'react';
import { motion } from 'framer-motion';

function LoadingView({
  imageSrc,
  title,
  description
}) {
  return (
    <div className="body-wrapper">
      <div className="container-fluid">
        <div className="row justify-content-center align-items-center">
          <div className="col-md-6">
            <div className="mt-5">
              <motion.div
                className="card-body d-flex flex-column justify-content-center align-items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {imageSrc && (
                  <motion.img
                    src={imageSrc}
                    height={300}
                    width={300}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                )}
                {title && (
                  <motion.h1
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {title}
                  </motion.h1>
                )}
                {description && (
                  <motion.p
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    {description}
                  </motion.p>
                )}
                <div className="d-flex justify-content-center align-items-center"></div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoadingView;
