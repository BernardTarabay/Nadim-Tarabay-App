export default function WorkTitle({ title, titleAr, year }) {
  return (
    <>
      {title}
      {titleAr && (
        <>
          ,{' '}
          <bdi lang="ar" dir="rtl">
            {titleAr}
          </bdi>
        </>
      )}
      {year && ` (${year})`}
    </>
  );
}
