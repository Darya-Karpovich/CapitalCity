import { Typography } from 'antd';
import React from 'react';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import { useQuery } from 'react-query';

import { getCapitalPhotos } from '../../../api/capital';
const Gallery = ({ capitalName }: { capitalName: string }) => {
  const images = useQuery({
    queryKey: ['capitalImages', capitalName],
    queryFn: () => getCapitalPhotos(capitalName),
    enabled: !!capitalName,
  });
  const newImages =
    images.data &&
    images.data.map(image => ({
      original: image.value,
      thumbnail: image.value,
    }));
  return (
    <div style={{ width: '500px' }}>
      {images.data?.length !== 0 && (
        <>
          <Typography.Text style={{ fontWeight: '500', fontSize: '54px' }}>
            Gallery
          </Typography.Text>
          {images.data && (
            <ImageGallery
              thumbnailPosition="left"
              items={newImages as unknown as ReactImageGalleryItem[]}
            />
          )}
        </>
      )}
    </div>
  );
};
export { Gallery };
