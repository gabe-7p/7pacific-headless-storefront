import { Container } from '~/components/common/Container';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion';
import { PRODUCT_TECH_STACK } from '~/modules/product/content/product-features';
import { getProductType } from '~/modules/product/lib/colorMap';

/**
 * PDP tech-stack accordion (live `tech-stack` section) — Materials / Details /
 * Care rows that vary by product type. Renders nothing for types with no rows.
 */
export const TechStack = ({ handle }: { handle: string }) => {
  const type = getProductType(handle);
  const rows = type ? PRODUCT_TECH_STACK[type] : undefined;
  if (!rows || rows.length === 0) return null;

  return (
    <Container className="max-w-3xl py-10 md:py-14">
      <Accordion type="multiple" defaultValue={[rows[0]!.label]}>
        {rows.map((row) => (
          <AccordionItem key={row.label} value={row.label}>
            <AccordionTrigger className="text-sm font-semibold tracking-[0.12em] uppercase">
              {row.label}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-1 text-sm text-neutral-600">
                {row.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </Container>
  );
};
