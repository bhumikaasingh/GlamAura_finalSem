import React, { useState, useEffect } from 'react';

const Typewriter = ({ words, typeSpeed = 150, deleteSpeed = 50, delaySpeed = 1000, loop = false }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(typeSpeed);

  useEffect(() => {
    const handleTyping = () => {
      const fullText = words[currentWordIndex];
      const updatedText = isDeleting
        ? fullText.substring(0, currentText.length - 1)
        : fullText.substring(0, currentText.length + 1);

      setCurrentText(updatedText);

      if (!isDeleting && updatedText === fullText) {
        setTimeout(() => setIsDeleting(true), delaySpeed);
        setSpeed(deleteSpeed);
      } else if (isDeleting && updatedText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        setSpeed(typeSpeed);
      }
    };

    const timer = setTimeout(handleTyping, speed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, speed, words, currentWordIndex, typeSpeed, deleteSpeed, delaySpeed]);

  return (
    <span className="border-r-2 border-orange-500 pr-1">{currentText}</span>
  );
};

export default Typewriter;
