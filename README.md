# Forma frontend

Next.js, React, RTK Query, Tailwind CSS va shadcn/ui asosidagi katalog va admin panel.

## Ishga tushirish

```sh
bun install
bun dev
```

`NEXT_PUBLIC_API_URL` backend manzilini ko‘rsatadi (odatda `http://localhost:8080`).

## Tuzilishi

- `components/ui/` — rasmiy registrydan olingan shadcn/ui primitivlari.
- `components/layout/` — brend, sayt header va footer komponentlari.
- `components/catalog/` — hero, filtrlar, grid va mahsulot ma’lumotlari.
- `components/admin/` — admin shell, statistika, jadval, o‘chirish dialogi va forma bo‘limlari.
- `components/shared/` — umumiy bo‘sh/xato holatlari va forma maydonlari.
- `hooks/` — katalog filtrlari va mahsulotni saqlash mantiqi.
- `features/` — RTK Query API endpointlari va auth holati.

Sahifalar kichik komponentlarni yig‘adi; API va forma mantiqi ko‘rinishdan ajratilgan.
Dizayn Tailwind klasslari bilan komponentlarning o‘zida yozilgan. `globals.css`
faqat Tailwind, animatsiya importlari va dark variant konfiguratsiyasini saqlaydi.

shadcn/ui komponentlari `components.json` orqali sozlangan; umumiy klasslar `cn()`
(`clsx` + `tailwind-merge`) bilan birlashtiriladi. Formadagi fokusni Input va Select
komponentlari o‘zi boshqaradi, layout inputlarga qo‘shimcha outline qo‘shmaydi.

`/admin` uchun mavjud admin yoki owner hisobi kerak. Token Redux xotirasida qoladi;
sahifa yangilanganda qayta kirish talab etiladi.

## Tekshirish

```sh
bun run lint
bun run build
```

## Valyutalar

Headerdagi shadcn DropdownMenu orqali USD, UZS yoki EUR tanlanadi. Tanlov Reduxda
joriy sessiya davomida saqlanadi va katalog, tafsilotlar hamda admin jadvalidagi
narxlarga qo‘llanadi. Baza va admin formasidagi summalar USD hisoblanadi.

`features/currency/` kurslarni tekshiradi, keshlaydi va narxlarni hisoblaydi;
`hooks/useCurrency.ts` umumiy formatlashni beradi. Kurslar kalitsiz ExchangeRate-API
(`https://www.exchangerate-api.com/docs/free`) manbasidan olinadi. So‘rovlar alohida,
auth headersiz transportdan yuboriladi. Kurs yuklanmasa USD ko‘rsatiladi, menyuda
qayta urinish tugmasi bor. Kurs sanasi va manba havolasi UI’da ko‘rsatiladi.

Konvertatsiya regressiya testlari:

```sh
bun test tests/currency.test.mjs
```
