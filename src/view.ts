import { syntaxTree } from "@codemirror/language";
import { RangeSetBuilder } from "@codemirror/state";
import {
  Decoration,
  DecorationSet,
  EditorView,
  PluginSpec,
  PluginValue,
  ViewPlugin,
  ViewUpdate,
} from "@codemirror/view";
import { Bullet } from "./bullet";
import CustomBullets from "./main";

class BulletListPlugin implements PluginValue {
  decorations: DecorationSet;

  constructor(view: EditorView) {
    this.decorations = this.buildDecorations(view);
  }

  update(update: ViewUpdate) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view);
    }
  }

  destroy() {}

  buildDecorations(view: EditorView): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();

    for (const { from, to } of view.visibleRanges) {
      syntaxTree(view.state).iterate({
        from,
        to,
        enter(node) {
          if (node.type.name.startsWith("list")) {
            // Position of the '-' or the '*'.
            let listCharFrom = node.from - 2;

            let minusNum = 0;
            while(view.state.doc.sliceString(listCharFrom-minusNum, listCharFrom+1-minusNum) == " ") {
                minusNum++;
            }

            listCharFrom -= minusNum;

            switch(view.state.doc.sliceString(listCharFrom, listCharFrom+1)) {
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
    }

    return builder.finish();
  }
}

const pluginSpec: PluginSpec<BulletListPlugin> = {
  decorations: (value: BulletListPlugin) => value.decorations,
};

export const bulletListPlugin = ViewPlugin.fromClass(
  BulletListPlugin,
  pluginSpec
);