import {
  pgTable,
  uuid,
  text,
  index,
  integer,
  customType,
  jsonb
} from 'drizzle-orm/pg-core';

const geometry = customType<{ data: string }>({
  dataType() {
    return 'geometry';
  },
})
export const boundary_layers = pgTable('boundary_layers',{
        id: uuid('id').defaultRandom().primaryKey(),
        city: text('city'),
        layerType: text('layer_type'),
        level: integer('level'),
        properties: jsonb('properties'),
        geom: geometry('geom'),
    },
    (table) => [
        // Creates the spatial GIST index on your geom column
        index('boundary_layers_geom_idx')
        .using('gist',table.geom),
    ]
)