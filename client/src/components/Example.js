import React, { useCallback, useState } from 'react';
import './Example.css'; // Add any additional styles for your Example component

const Example = () => {
  const [tags, setTags] = useState([]);
  const [query, setQuery] = useState('');

  // Constant variable for tag names
  const tagNames = tags.map(tag => tag.name);

  // Handle tag addition
  const onAddition = useCallback(
    (newTag) => {
      if (newTag && !tags.find((tag) => tag.name === newTag.name)) {
        setTags((prevTags) => [...prevTags, newTag]);
      }
    },
    [tags]
  );

  // Handle tag deletion
  const onDelete = useCallback((tagIndex) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== tagIndex));
  }, []);

  // Handle input changes
  const onInput = useCallback((query) => {
    setQuery(query);
  }, []);

  // Handle input key press to add tag
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault(); // Prevent default form submission or other behavior
      onAddition({ id: tags.length + 1, name: query.trim() });
      setQuery(''); // Clear input after adding
    }
  };

  // Handle input blur event to create tag if input is not empty
  const handleBlur = () => {
    if (query.trim()) {
      onAddition({ id: tags.length + 1, name: query.trim() });
      setQuery(''); // Clear input after adding
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    // Convert tagNames to a plain array format
    const plainArray = tagNames;
  
    // Posting data as plain array
    fetch('/api/tags', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(plainArray), // Send the plain array directly
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
  

  return (
    <div>
      <p>Select or add tags below:</p>
      <div className="tag-input-container">
        {tags.map((tag, index) => (
          <span key={index} className="tag">
            {tag.name}
            <button
              type="button"
              onClick={() => onDelete(index)}
              className="tag-remove-button"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={query}
          onChange={(e) => onInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          placeholder="Add new tag"
          className="tag-input"
        />
      </div>
      <p><b>Tag Names:</b></p>
      <pre><code>{JSON.stringify(tagNames, null, 2)}</code></pre>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default Example;
