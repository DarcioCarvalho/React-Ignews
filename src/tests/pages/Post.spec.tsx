import { render, screen } from '@testing-library/react';
import { getSession } from 'next-auth/react';
import { mocked } from 'ts-jest/utils';

import { stripe } from '../../services/stripe';
import { getPrismicClient } from '../../services/prismic';
import Post, { getServerSideProps } from '../../pages/posts/[slug]';


jest.mock('../../services/stripe');
jest.mock('../../services/prismic');
jest.mock('next-auth/react');


const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post content</p>',
  updateAt: '07 de Setembro'
}

describe('Post page', () => {
  it('renders correctly', () => {

    render(<Post post={post} />);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
  });

  it('redirects user if no subscription is found', async () => {
    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/',
        })
      })
    );

  });

  it('loads initial data', async () => {

    const getSessionMocked = mocked(getSession);

    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: 'fake-active-subscription'
    } as any);

    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValue(
        {
          data: {
            title: [
              { type: 'heading', text: 'My new post' }
            ],
            content: [
              { type: 'paragraph', text: 'Post content' }
            ],
          },
          last_publication_date: '09-07-2023'
        }
      )
    } as any)


    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          post: {
            slug: 'my-new-post',
            title: 'My new post',
            content: '<p>Post content</p>',
            updateAt: '07 de setembro de 2023'
          }
        }
      })
    )
  });
})
