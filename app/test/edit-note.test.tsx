
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Note from '~/components/Note';
import { NoteResponse } from '~/services/contacts';

// Mock the updateNote function
vi.mock('~/services/contacts', () => ({
  updateNote: vi.fn().resolves({ success: true }),
}));

describe('Note component', () => {
  it('should render the note in view mode', () => {
    const note: NoteResponse = {
      _id: '123',
      data: { body: 'Test note content' },
      fullDefinition: {
        definitionName: 'note',
        title: 'Note',
        plural: 'Notes',
        fields: [],
      },
      created: new Date().toISOString(),
      author: { name: 'Test User' },
    };

    render(<Note {...note} />);

    expect(screen.getByText('Test note content')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });

  it('should switch to edit mode when edit link is clicked', () => {
    const note: NoteResponse = {
      _id: '123',
      data: { body: 'Test note content' },
      fullDefinition: {
        definitionName: 'note',
        title: 'Note',
        plural: 'Notes',
        fields: [],
      },
      created: new Date().toISOString(),
      author: { name: 'Test User' },
    };

    render(<Note {...note} />);

    fireEvent.click(screen.getByText('Edit'));

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('should call onSave when save button is clicked', () => {
    const note: NoteResponse = {
      _id: '123',
      data: { body: 'Test note content' },
      fullDefinition: {
        definitionName: 'note',
        title: 'Note',
        plural: 'Notes',
        fields: [],
      },
      created: new Date().toISOString(),
      author: { name: 'Test User' },
    };

    const onSave = vi.fn();
    render(<Note {...note} onSave={onSave} />);

    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated content' } });
    fireEvent.click(screen.getByText('Save'));

    expect(onSave).toHaveBeenCalled();
  });
});
