import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { phosphorCaretDown } from '@ng-icons/phosphor-icons/regular';
import { HlmIcon } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-select-scroll-down',
	imports: [NgIcon, HlmIcon],
	providers: [provideIcons({ phosphorCaretDown })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: `
		<ng-icon hlm size="sm" class="ml-2" name="phosphorCaretDown" />
	`,
})
export class HlmSelectScrollDown {
	constructor() {
		classes(() => 'flex cursor-default items-center justify-center py-1');
	}
}
