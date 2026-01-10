# Tarefas Pendentes - ArqLopes Site

## Contexto
O frontend foi completamente convertido para ser dinâmico, buscando dados do CMS/R2. Todos os componentes principais (Hero, About, Gallery, Clients, Footer) agora funcionam com dados do admin.

## Problemas Reportados pelo Usuário

### 1. Favicon não está carregando
**Ação necessária:**
- Criar arquivo `favicon.ico` na pasta `public/` OU
- Adicionar configuração de ícone no `app/layout.tsx`:
  ```typescript
  export const metadata: Metadata = {
    title: "...",
    description: "...",
    icons: {
      icon: '/logos/arqlopes-logo.svg',
    },
  }
  ```

### 2. Alguns ícones com erro
**Ação necessária:**
- Verificar no console do browser quais ícones específicos estão falhando
- Possíveis causas:
  - Ícones ainda apontando para `/icons/` ao invés da URL do R2
  - Falta fazer upload de alguns ícones para o R2
- Verificar especialmente:
  - Hero services icons (já devem estar corretos - usam `service.icon` do R2)
  - Footer icons (phone, mail, location) - ainda apontam para `/icons/` local
  - Gallery arrows - ainda apontam para `/icons/` local

**Componentes a verificar:**
- `components/footer.tsx` - linhas com `/icons/phone-icon.svg`, `/icons/mail-icon.svg`, `/icons/location-icon.svg`
- `components/galery.tsx` - linhas com `/icons/arrow-left-icon.svg`, `/icons/arrow-right-icon.svg`

**Solução:**
- Alterar paths de `/icons/X.svg` para URLs do R2: `https://pub-9def9de695584c4c8300c62ce8af1bbd.r2.dev/images/general/X.svg`
- Confirmar que esses arquivos existem no R2 (foram enviados pelo seed script)

### 3. Metadata ainda está hardcoded
**Ação necessária:**
- Atualizar `app/layout.tsx` para buscar metadata dinamicamente:
  ```typescript
  import { getSiteMetadata } from "@/lib/content";
  
  export async function generateMetadata(): Promise<Metadata> {
    const metadata = await getSiteMetadata();
    
    return {
      title: metadata.seoTitle,
      description: metadata.seoDescription,
      openGraph: {
        title: metadata.seoTitle,
        description: metadata.seoDescription,
        images: [metadata.ogImage],
      },
    };
  }
  ```

## Arquivos Modificados Recentemente
- `app/page.tsx` - Agora busca dados do CMS
- `components/hero.tsx` - Dinâmico
- `components/about.tsx` - Dinâmico
- `components/galery.tsx` - Dinâmico
- `components/clients.tsx` - Dinâmico
- `components/footer.tsx` - Dinâmico
- `scripts/seed-r2.mjs` - Corrigido para Windows + adicionado `--remote`

## Como Testar
1. Acesse o site de produção
2. Verifique o console do browser para erros de carregamento
3. Acesse `/admin` e altere algum conteúdo
4. Aguarde 60 segundos (revalidate) ou force refresh
5. Verifique se a alteração aparece no frontend

## Observações Importantes
- O revalidate está configurado para 60 segundos em `app/page.tsx`
- Dados estão no R2 bucket: `arqlopes-assets`
- URL pública do R2: `https://pub-9def9de695584c4c8300c62ce8af1bbd.r2.dev`
- Todos os ícones devem apontar para `images/general/` no R2
