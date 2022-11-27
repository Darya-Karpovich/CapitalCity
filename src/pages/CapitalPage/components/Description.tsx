import Paragraph from 'antd/lib/typography/Paragraph';
import React from 'react';

const Description = ({ text }: { text: string }) => {
  return (
    <>
      <Paragraph
        ellipsis={{ rows: 10, expandable: true, symbol: 'more' }}
        style={{
          whiteSpace: 'pre-wrap',
          width: '80%',
          background: 'rgba(250,250,250,0.5)',
          padding: '30px',
          margin: '20px 0',
        }}
      >
        {'\t\t' + text.replaceAll('\n', '\n\n\t\t')}
      </Paragraph>
    </>
  );
};
export { Description };
