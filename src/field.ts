import { syntaxTree } from "@codemirror/language";
import {
  Extension,
  RangeSetBuilder,
  StateField,
  Transaction,
} from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
} from "@codemirror/view";
import { Bullet } from "./bullet";
import CustomBullets from "./main";

export const bulletListField = StateField.define<DecorationSet>({
  create(state): DecorationSet {
    return Decoration.none;
  },
  update(oldState: DecorationSet, transaction: Transaction): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();

    syntaxTree(transaction.state).iterate({
      enter(node) {
        if (node.type.name.startsWith("list")) {
            // Position of the '-' or the '*'.
            const listCharFrom = node.from - 2;

            switch(transaction.state.doc.sliceString(listCharFrom, listCharFrom+1)) {
              case "-":
                builder.add(
                  listCharFrom,
                  listCharFrom + 1,
                  Decoration.replace({
                    widget: new Bullet(CustomBullets.settings.dash),
                  })
                );
                break;
              case "*":
                builder.add(
                  listCharFrom,
                  listCharFrom + 1,
                  Decoration.replace({
                    widget: new Bullet(CustomBullets.settings.star),
                  })
                );
                break;
              case "+":
                builder.add(
                  listCharFrom,
                  listCharFrom + 1,
                  Decoration.replace({
                    widget: new Bullet(CustomBullets.settings.plus),
                  })
                );
                break;
            }
        }
      },
    });

    return builder.finish();
  },
  provide(field: StateField<DecorationSet>): Extension {
    return EditorView.decorations.from(field);
  },
});