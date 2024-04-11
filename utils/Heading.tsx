import React, { FC } from 'react';

const Heading: FC<HeadProps> = (props: HeadProps) => {
  return (
    <>
      <title>{props.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="description" content={props.description} />
      <meta name="keywords" content={props.keywords} />
    </>
  );
};

export default Heading;
