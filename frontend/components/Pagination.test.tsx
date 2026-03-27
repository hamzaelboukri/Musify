import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders nothing when totalItems is 0', () => {
    const { container } = render(
      <Pagination currentPage={1} totalItems={0} perPage={10} onPageChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when only one page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalItems={5} perPage={10} onPageChange={() => {}} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it('shows page info and calls onPageChange on Next', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalItems={25} perPage={10} onPageChange={onPageChange} itemLabel="songs" />,
    );

    expect(screen.getByText(/1 \/ 3/)).toBeInTheDocument();
    expect(screen.getByText(/songs/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /next page/i }));
    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with previous page when Previous clicked', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={2} totalItems={25} perPage={10} onPageChange={onPageChange} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it('disables previous on first page', () => {
    const onPageChange = vi.fn();
    render(
      <Pagination currentPage={1} totalItems={30} perPage={10} onPageChange={onPageChange} />,
    );

    expect(screen.getByRole('button', { name: /previous page/i })).toBeDisabled();
  });
});
