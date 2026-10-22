export default function Picture({ src, alt, mobileSrc, priority = false, className }) {
  const img = (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : undefined}
      decoding="async"
    />
  );
  if (!mobileSrc) return img;
  return (
    <picture>
      <source media="(max-width: 767px)" srcSet={mobileSrc} />
      {img}
    </picture>
  );
}
