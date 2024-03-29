import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { stripe } from '../../services/stripe';
import { getPrismicClient } from '../../services/prismic';
import Posts, { getStaticProps } from '../../pages/posts';


jest.mock('../../services/stripe');
jest.mock('../../services/prismic');


const posts = [{
  slug: 'my-new-post',
  title: 'My New Post',
  excerpt: 'Post excerpt',
  updateAt: '07 de Setembro'
}]

describe('Posts page', () => {
  it('renders correctly', () => {

    render(<Posts posts={posts} />);

    expect(screen.getByText('My New Post')).toBeInTheDocument();
  });

  it('loads initial data', async () => {

    const getPrismicClientMocked = mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      query: jest.fn().mockResolvedValue({
        results: [
          {
            uid: 'my-new-post',
            data: {
              title: [
                { type: 'heading', text: 'My new post' }
              ],
              content: [
                { type: 'paragraph', text: 'Post excerpt' }
              ],
            },
            last_publication_date: '09-07-2023'
          }
        ]
      })
    } as any)


    const response = await getStaticProps({});

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [
            {
              slug: 'my-new-post',
              title: 'My new post',
              excerpt: 'Post excerpt',
              updateAt: '07 de setembro de 2023'
            }
          ]
        }
      })
    )
  });
})
