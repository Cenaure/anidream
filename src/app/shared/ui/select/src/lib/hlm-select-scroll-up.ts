import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorCaretUp } from '@ng-icons/phosphor-icons/regular';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-select-scroll-up',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ phosphorCaretUp })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-icon hlm size="sm" class="ml-2" name="phosphorCaretUp" />
	`,
})
export class HlmSelectScrollUp {
	constructor() {
		classes(() => 'flex cursor-default items-center justify-center py-1');
	}
}
