import React, { useState, MouseEvent, KeyboardEvent } from 'react';
import styles from './InteractiveCard.module.css';

interface InteractiveCardProps {
  imageUrl: string;
  title: string;
  subtitle: string;
  uuid: string;
  isSelected: boolean;
  onClick: (uuid: string) => void;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  imageUrl,
  title,
  subtitle,
  uuid,
  isSelected,
  onClick,
}) => {
  const handleCardClick = (event: MouseEvent | KeyboardEvent) => {
    if (onClick) {
      onClick(uuid);
    }
  };

  const handleKeyPress = (event: KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCardClick(event);
    }
  };

  return (
    <div
      className={`${styles.card} ${isSelected ? styles.selected : ''}`}
      onClick={handleCardClick}
      onKeyDown={handleKeyPress}
      tabIndex={0}
      role="button"
      data-testid="card"
    >
      <div className={styles['selection-icon']} data-testid="selection-icon">
        {isSelected && <span className={styles['checkmark']}>&#10003;</span>}
      </div>
      <img
        src={imageUrl}
        alt={title}
        className={styles['card-image']}
        data-testid="card-image"
      />
      <div
        className={styles['card-title']}
        title={title}
        data-testid="card-title"
      >
        {title}
      </div>
      <div className={styles['card-subtitle']} data-testid="card-subtitle">
        {subtitle}
      </div>
      <div className={styles['card-uuid']} data-testid="card-uuid">
        UUID : {uuid}
      </div>
    </div>
  );
};

export default InteractiveCard;