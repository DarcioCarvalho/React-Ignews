import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';

import { stripe } from '../../services/stripe';
import { getPrismicClient } from '../../services/prismic';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';



jest.mock('../../services/stripe');
jest.mock('../../services/prismic');
jest.mock('next-auth/react');
jest.mock('next/router');


const post = {
  slug: 'my-new-post',
  title: 'My New Post',
  content: '<p>Post content</p>',
  updateAt: '07 de Setembro'
}

describe('Post Preview page', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: 'loading'
    } as any)

    render(<Post post={post} />);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
    expect(screen.getByText('Post content')).toBeInTheDocument();
    expect(screen.getByText('Wanna continue reading?')).toBeInTheDocument();
  });

  it('redirects user to full post when user is subscribed', async () => {
    const useSessionMocked = mocked(useSession);
    const useRouterMocked = mocked(useRouter);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: 'fake-active-subscription'
      }
    } as any)

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<Post post={post} />);

    expect(pushMock).toHaveBeenCalledWith('/posts/my-new-post');


  });

  it('loads initial data', async () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: 'fake-active-subscription'
      }
    } as any)


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


    const response = await getStaticProps({
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
