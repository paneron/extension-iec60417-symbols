/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import { PropertyDetailView } from '@riboseinc/paneron-registry-kit/views/util';
import { ItemClassConfiguration } from '@riboseinc/paneron-registry-kit/types/views';
import { Classes, Colors, ControlGroup, InputGroup, Tag, TagInput } from '@blueprintjs/core';


const DoubleLanguagePropertyDetailView: React.FC<{
  values: { [langID: string]: any }
  ValueWidget: React.FC<{ value: any, onChange?: (newValue: any) => void }>
  onChange?: (newValues: { [langID: string]: any }) => void
}> = function ({ values, ValueWidget, onChange }) {
  function handleChange(langID: string, value: any) {
    if (!onChange) { return; }
    onChange({ ...values, [langID]: value });
  }

  return (
    <ControlGroup fill>
      {Object.entries(values).map(([langID, value]) =>
        <div css={css`width: 50%;`}>
          <Tag minimal css={css`margin-bottom: .25rem;`}>{langID}</Tag>
          <ValueWidget value={value} onChange={(newVal) => handleChange(langID, newVal)} />
        </div>
      )}
    </ControlGroup>
  )
}


const MaybeTextarea: React.FC<{ value: any }> = function ({ value }) {
  if (value) {
    return <div css={css`padding-right: 1rem;`} dangerouslySetInnerHTML={{ __html: value }} />;
  } else {
    return <span css={css`padding: 0 1rem;`}>—</span>;
  }
}


interface SymbolData {
  identifier: string
  title: {
    eng: string
    fre: string
  }
  publishedIn: string
  attachments: {
    [attachmentID: string]: null | {
      data: string // base64
      mime: string
    }
  }
  authors: string[]
  description: {
    eng: string
    fre: string
  }
  fieldOfApplication: string[]
  form: {
    arrows: string
    arrowsDouble: string | null // TODO
    barrels: string
    circles: string
    lines: string
    objectsOrdinaryUsers: string | null
    objectsTechnicalUsers: string | null
    objectsStandardized: string | null
    recognizableObjects: string | null
    polygons: string
    rectangles: string
    shields: string
    squares: string
    triangles: string
  }
  function: string[]
  geometricForm: string[]
  keywords: {
    eng: string[]
    fre: string[]
  }
  notes: {
    eng: string
    fre: string
  }
  prefix: string
  preview: string
  productArea: {
    eng: string
    fre: string
  }
  relevantPublications: string[]
  relevantTCs: string[]
  remarks: {
    eng: string
    fre: string
  }
  replacing: string[]
  std: string
}


const symbol: ItemClassConfiguration<SymbolData> = {
  meta: {
    title: "Symbol",
    description: "Describes a symbol that can be placed on equipment (from automobiles and home entertainment products to earth-moving machinery) to indicate how to use it correctly and safely.",
    id: 'symbols',
    alternativeNames: [],
  },
  defaults: {
    replacing: [],
    relevantPublications: [],
    identifier: '',
    relevantTCs: [],
    geometricForm: [],
    title: {
      eng: '',
      fre: '',
    },
    prefix: '',
    preview: '',
    form: {
      arrows: '',
      arrowsDouble: '',
      barrels: '',
      circles: '',
      lines: '',
      objectsOrdinaryUsers: '',
      objectsTechnicalUsers: '',
      objectsStandardized: '',
      recognizableObjects: '',
      polygons: '',
      rectangles: '',
      shields: '',
      squares: '',
      triangles: '',
    },
    function: [],
    fieldOfApplication: [],
    authors: [],
    notes: {
      eng: '',
      fre: '',
    },
    remarks: {
      eng: '',
      fre: '',
    },
    productArea: {
      eng: '',
      fre: '',
    },
    description: {
      eng: '',
      fre: '',
    },
    keywords: {
      eng: [],
      fre: [],
    },
    publishedIn: '',
    std: '',
    attachments: {},
  },
  itemSorter: (p1, p2) => (p1.identifier || '').localeCompare(p2.identifier || ''),
  sanitizePayload: async (p) => p,
  validatePayload: async () => true,

  views: {
    listItemView: ({ itemData, className }) =>
      <span className={className}>
        <code>{itemData.identifier}</code>
        &emsp;
        {itemData.title?.eng || '—'}
      </span>,
    editView: ({ itemData, className, onChange }) => {
      const {
        identifier,
        title,
        description,
        authors,
        keywords,
        replacing,
        relevantTCs,
        fieldOfApplication,
        relevantPublications,
        productArea,
        notes,
        remarks,
        std,
        publishedIn,
        prefix,
        attachments,
      } = itemData;

      const attachmentViews = Object.entries((attachments ?? {})).map(([attachmentID, attachment]) => {
        let view: JSX.Element;
        if (attachment !== null) {
          const dataURL = `data:${attachment.mime};base64,${attachment.data}`;
          view = <img css={css`display: block`} src={dataURL} />;
        } else {
          view = <p>—</p>;
        }
        return (
          <div css={css`margin-bottom: 1rem;`}>
            <Tag minimal css={css`padding-bottom: .25rem;`} icon="paperclip">{attachmentID}</Tag>
            {view}
          </div>
        );
      });

      return (
        <div className={className} css={css`
            position: absolute; top: 0rem; left: 0rem; right: 0rem; bottom: 0rem;

            display: flex; flex-flow: row nowrap; overflow: hidden;

            @media (max-width: 1000px) {
              flex-flow: column nowrap;
            }

            & > * { padding: 1rem; }`}>

          <div css={css`overflow-y: auto; flex: 1;`}>
            <PropertyDetailView title="Identifier">
              {identifier}
            </PropertyDetailView>

            <PropertyDetailView title="Title">
              <DoubleLanguagePropertyDetailView
                values={title}
                ValueWidget={({ value }) => <InputGroup readOnly value={value} />}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Prefix">
              {prefix}
            </PropertyDetailView>

            <PropertyDetailView title="Std.">
              {std}
            </PropertyDetailView>

            <PropertyDetailView title="Published in">
              {publishedIn}
            </PropertyDetailView>

            <PropertyDetailView title="Product area">
              <DoubleLanguagePropertyDetailView
                values={productArea}
                ValueWidget={MaybeTextarea}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Description">
              <DoubleLanguagePropertyDetailView
                values={description}
                ValueWidget={MaybeTextarea}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Notes">
              <DoubleLanguagePropertyDetailView
                values={notes}
                ValueWidget={MaybeTextarea}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Function">
              <TagInput
                disabled={!onChange}
                onChange={(val) => onChange!({ ...itemData, fieldOfApplication: val.map(val => val?.toString() ?? null).filter(val => val !== null) as string[] })}
                leftIcon="locate"
                values={itemData.function}
              />
            </PropertyDetailView>
            <PropertyDetailView title="Field of application">
              <TagInput
                disabled={!onChange}
                onChange={(val) => onChange!({ ...itemData, fieldOfApplication: val.map(val => val?.toString() ?? null).filter(val => val !== null) as string[] })}
                leftIcon="search-around"
                values={fieldOfApplication}
              />
            </PropertyDetailView>
            <PropertyDetailView title="Relevant TCs">
              <TagInput
                disabled={!onChange}
                onChange={(val) => onChange!({ ...itemData, relevantTCs: val.map(val => val?.toString() ?? null).filter(val => val !== null) as string[] })}
                leftIcon="people"
                values={relevantTCs}
              />
            </PropertyDetailView>
            <PropertyDetailView title="Relevant publications">
              <TagInput
                disabled={!onChange}
                onChange={(val) => onChange!({ ...itemData, relevantPublications: val.map(val => val?.toString() ?? null).filter(val => val !== null) as string[] })}
                leftIcon="book"
                values={relevantPublications}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Replacing">
              <TagInput
                disabled={!onChange}
                onChange={(val) => onChange!({ ...itemData, replacing: val.map(val => val?.toString() ?? null).filter(val => val !== null) as string[] })}
                leftIcon="flows"
                values={replacing}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Authors">
              <TagInput
                disabled={!onChange}
                onChange={(val) => onChange!({ ...itemData, authors: val.map(val => val?.toString() ?? null).filter(val => val !== null) as string[] })}
                leftIcon="user"
                values={authors}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Remarks">
              <DoubleLanguagePropertyDetailView
                values={remarks}
                ValueWidget={MaybeTextarea}
              />
            </PropertyDetailView>

            <PropertyDetailView title="Keywords">
              <DoubleLanguagePropertyDetailView
                values={keywords}
                onChange={onChange ? ((val) => onChange!({ ...itemData, keywords: val as { eng: string[], fre: string[] } })) : undefined}
                ValueWidget={({ value, onChange }) =>
                  <TagInput disabled={!onChange} onChange={onChange} leftIcon="tag" values={value} />
                }
              />
            </PropertyDetailView>
          </div>


          <aside
              css={css`
                overflow-y: auto;
                flex-basis: 180px; background: ${Colors.LIGHT_GRAY4};
              `}
              className={Classes.ELEVATION_1}>
            <PropertyDetailView title="Attachments">
              {attachmentViews}
            </PropertyDetailView>
          </aside>

        </div>
      );
    },
  },
};


export const itemClassConfiguration = {
  symbols: symbol,
};
