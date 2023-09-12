import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { Async } from '.';


test('it renders correctly a async component (findBy)', async () => {
  render(<Async />);

  expect(screen.getByText('Hello World')).toBeInTheDocument();
  expect(await screen.findByText('Button')).toBeInTheDocument();
});

test('it renders correctly a async component (waitFor)', async () => {
  render(<Async />);

  expect(screen.getByText('Hello World')).toBeInTheDocument();

  await waitFor(() => {
    return expect(screen.getByText('Button')).toBeInTheDocument();
  })
});

test('it renders correctly a async component (waitFor)', async () => {
  render(<Async />);

  expect(screen.getByText('Hello World')).toBeInTheDocument();

  await waitFor(() => {
    return expect(screen.getByText('Button')).toBeInTheDocument();
  })

  await waitFor(() => {
    return expect(screen.queryByText('Button Two')).not.toBeInTheDocument();
  })
});

test('it renders correctly a async component (waitFor)', async () => {
  render(<Async />);

  expect(screen.getByText('Hello World')).toBeInTheDocument();

  await waitForElementToBeRemoved(screen.queryByText('Button Two'));

});