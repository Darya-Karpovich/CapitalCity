import {
  Button,
  Layout,
  Radio,
  RadioChangeEvent,
  Row,
  Space,
  Typography,
} from 'antd';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'react-router-dom';

import { getCapitalInfo, getCapitalInfoByCountry } from '../../api/capital';
import { getReviewsForCapital } from '../../api/review';
import { getCapitalStatusForUser } from '../../api/status';
import { useIpLookup, useLocation } from '../../api/weather';
import { CapitalCard } from '../../components/CapitalCard';
import { CommentCard } from '../../components/Comment/CommentCard';
import { Converter } from '../../components/Converter/Converter';
import { ReviewForm } from '../../components/ReviewForm/ReviewForm';
import { StatusModal } from '../../components/StatusModal/StatusModal';
import { WeatherCard } from '../../components/WeatherCard/WeatherCard';
import { ReviewDB } from '../../lib/types';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import './CapitalPage.less';
import { Description } from './components/Description';
import { Gallery } from './components/Gallery';
import { RatingCard } from './components/RatingCard';

type Ratings = {
  general: number;
  food: number;
  attractions: number;
  transport: number;
};

// const getAverage = (array: any, key: string) => {
//   return (
//     Math.round(
//       (array.reduce((total, next) => total + next[key], 0) / array.length) * 10,
//     ) / 10
//   );
// };

// eslint-disable-next-line complexity
const CapitalPage = () => {
  const { capital } = useParams();
  const { theme } = useThemeStore();
  const { token } = useAuthStore();
  const [modal, setModal] = useState(false);
  const [converter, setConverter] = useState(false);
  const [sorting, setSorting] = useState('');

  const query = useQuery({
    queryKey: ['capital', capital],
    queryFn: () => getCapitalInfo(capital || ''),
    enabled: !!capital,
  });

  const { data: ip } = useIpLookup();

  const myCountry = useQuery({
    queryKey: ['capitalCountry', ip?.country_name],
    queryFn: () => getCapitalInfoByCountry(ip?.country_name || ''),
    enabled: !!ip?.country_name,
  });

  const reviews = useQuery({
    queryKey: ['rewiews', [capital, sorting]],
    queryFn: () =>
      getReviewsForCapital({
        capitalName: capital || '',
        token: token || '',
        optionalSort: sorting,
      }),
    enabled: !!capital,
  });

  const status = useQuery({
    queryKey: ['status', [capital, token]],
    queryFn: () =>
      getCapitalStatusForUser({
        capitalName: capital || '',
        token: token || '',
      }),
    enabled: !!capital,
  });

  const coordinates = query.data?.coordenates;
  const { data } = useLocation(
    coordinates?.substring(1, coordinates.length - 1).replace(/\s/g, '') || '',
  );

  const average = (reviews: ReviewDB[]): Ratings => {
    const general =
      Math.round(
        (reviews.reduce((total, next) => total + next.ratingGeneral, 0) /
          reviews.length) *
          10,
      ) / 10;
    const food =
      Math.round(
        (reviews.reduce((total, next) => total + next.ratingFood, 0) /
          reviews.length) *
          10,
      ) / 10;
    const attractions =
      Math.round(
        (reviews.reduce((total, next) => total + next.ratingAttraction, 0) /
          reviews.length) *
          10,
      ) / 10;
    const transport =
      Math.round(
        (reviews.reduce((total, next) => total + next.ratingTransport, 0) /
          reviews.length) *
          10,
      ) / 10;
    return { general, food, attractions, transport };
  };

  const onHandleClick = () => {
    setConverter(!converter);
  };

  const handleSort = ({ target: { value } }: RadioChangeEvent) => {
    setSorting(value as string);
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    reviews.refetch();
  };

  const options = [
    { label: 'Date', value: 'creationTime' },
    { label: 'Likes', value: 'likeRatio' },
    { label: 'Rating', value: 'ratingGeneral' },
  ];

  const renderContent = () => {
    if (token && reviews.data) {
      if (reviews.data.length === 0) {
        return (
          <Space align="center" style={{ height: '100%' }}>
            <Typography.Paragraph
              className="login-text"
              style={{
                backgroundColor:
                  theme === 'light'
                    ? 'rgba(250,250,250, 0.5)'
                    : 'rgba(0,0,0,0.5)',
              }}
            >
              There is no comment yet
            </Typography.Paragraph>
          </Space>
        );
      }
      return (
        <>
          <Space
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              width: '100%',
              marginTop: '20px',
            }}
          >
            <Radio.Group
              options={options}
              onChange={handleSort}
              optionType="button"
              buttonStyle="solid"
              style={{ border: '3px solid #fff' }}
            />
          </Space>
          {reviews.data.map(
            (r, idx) =>
              r.commentStatus === 'ACTIVE' && (
                <CommentCard
                  key={idx}
                  review={r}
                  onRefetch={reviews.refetch}
                  token={token || ''}
                />
              ),
          )}
        </>
      );
    }

    return (
      <Space align="center" style={{ height: '100%' }}>
        <Typography.Paragraph
          className="login-text"
          style={{
            backgroundColor:
              theme === 'light' ? 'rgba(250,250,250, 0.5)' : 'rgba(0,0,0,0.5)',
          }}
        >
          You need to log in to see reviews
        </Typography.Paragraph>
      </Space>
    );
  };

  return (
    <Layout data-theme={theme} className="layout">
      <Layout.Content className="content">
        {query.data && (
          <>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <CapitalCard
                name={query.data?.name}
                country={query.data?.country}
                image={
                  query.data.flaglocation
                    ? query.data.flaglocation.value
                    : undefined
                }
              />

              {token && (
                <Space
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography.Paragraph
                    style={{
                      fontSize: '24px',
                      background: '#ffcd75',
                      padding: '0 20px',
                    }}
                  >
                    {status.data === 'UNDEFINED'
                      ? 'Not visited'
                      : status.data === 'WANTVISIT'
                      ? 'want to visit'
                      : 'visited'}
                  </Typography.Paragraph>
                  <StatusModal capital={query.data?.name} />
                </Space>
              )}
              <Space.Compact direction="vertical">
                <Button onClick={onHandleClick} style={{ width: '210px' }}>
                  Conver
                </Button>
                {converter && myCountry.data?.currency && (
                  <Converter
                    toCurr={myCountry.data?.currency}
                    fromCurr={query.data.currency}
                  />
                )}
              </Space.Compact>
              {data && (
                <WeatherCard
                  icon={data.current.condition.icon}
                  text={data.current.condition.text}
                  temperature={data.current.temp_c}
                  feelsLike={data.current.feelslike_c}
                />
              )}
            </div>
            {reviews.data && reviews.data?.length !== 0 && (
              <Row
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'space-around',
                  padding: '30px',
                }}
              >
                <RatingCard
                  category="General"
                  value={average(reviews.data).general}
                />
                <RatingCard
                  category="Food"
                  value={average(reviews.data).food}
                />
                <RatingCard
                  category="Attractions"
                  value={average(reviews.data).attractions}
                />
                <RatingCard
                  category="Transport"
                  value={average(reviews.data).transport}
                />
              </Row>
            )}
            {token && (
              <Button
                data-theme={theme}
                type="primary"
                onClick={() => setModal(true)}
                style={{ margin: '10px 0' }}
              >
                Add review
              </Button>
            )}
            <Description text={query.data?.description} />
            <Gallery capitalName={capital || ''} />
          </>
        )}
        {modal && (
          <ReviewForm
            capitalName={capital || ''}
            closeModal={() => {
              setModal(false);
              reviews
                .refetch()
                .then()
                .catch(() => {
                  //
                });
            }}
          />
        )}
      </Layout.Content>
      <Layout.Sider data-theme={theme} width={550} className="sider">
        {renderContent()}
      </Layout.Sider>
    </Layout>
  );
};

export { CapitalPage };
