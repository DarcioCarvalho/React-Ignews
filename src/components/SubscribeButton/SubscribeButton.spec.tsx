import { fireEvent, render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/react');
jest.mock('next/router'/* , () => {
  return {
    useRouter() {
      return {
        push: jest.fn()
      }
    }
  }
} */)

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession);
    (useSessionMocked as any).mockReturnValueOnce({ data: null, status: "loading" });

    render(<SubscribeButton />)
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  });

  it('redirects user to sign in when not authenticated', () => {
    const useSessionMocked = mocked(useSession);
    (useSessionMocked as any).mockReturnValueOnce({ data: null, status: "loading" });

    const signInMocked = mocked(signIn);

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(signInMocked).toBeCalled();
  });

  it('redirects to post when user already has a subscription', () => {
    const useRouterMocked = mocked(useRouter);
    const useSessionMocked = mocked(useSession);
    const pushMock = jest.fn();

    useSessionMocked.mockReturnValueOnce(
      {
        data: {
          user: {
            name: 'John Doe',
            email: 'john.doe@example.com'
          },
          activeSubscription: 'fake-active-subscription',
          expires: 'fake-expires'
        },
        status: "authenticated",
        update: null
      });

    useRouterMocked.mockReturnValueOnce({
      push: pushMock
    } as any)

    render(<SubscribeButton />);

    const subscribeButton = screen.getByText('Subscribe now');

    fireEvent.click(subscribeButton);

    expect(pushMock).toHaveBeenCalledWith('/posts')
  })

})
