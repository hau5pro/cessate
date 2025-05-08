import { AnimationControls, motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import { motivationalQuotes } from './motivationalQuotes';

const getRandomQuote = () =>
  motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

const QuoteDisplay = ({ controls }: { controls: AnimationControls }) => {
  const [quote, setQuote] = useState(getRandomQuote());

  useEffect(() => {
    setQuote(getRandomQuote());
  }, []);

  const words = quote.text.split(' ');

  return (
    <Box
      textAlign="center"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        flexGrow: 1,
        padding: 2,
      }}
    >
      <Typography variant="h3" gutterBottom>
        <Box component="span" display="inline-block">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={controls}
              transition={{ delay: index * 0.15 }}
              style={{ display: 'inline-block', marginRight: '6px' }}
            >
              {word}
            </motion.span>
          ))}
        </Box>
      </Typography>
      <motion.div
        initial={{ opacity: 0 }}
        animate={controls}
        transition={{ delay: words.length * 0.15 + 0.5 }}
      >
        <Typography variant="body1" color="textSecondary" mt={1}>
          — {quote.author}
        </Typography>
      </motion.div>
    </Box>
  );
};

export default QuoteDisplay;
