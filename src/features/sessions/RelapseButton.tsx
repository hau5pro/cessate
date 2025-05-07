import BaseButton from '@components/BaseButton';

function RelapseButton() {
  return (
    <BaseButton color="secondary">
      R<span style={{ transform: 'rotateY(180deg)' }}>e</span>lapse
    </BaseButton>
  );
}

export default RelapseButton;
