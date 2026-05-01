import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { phosphorDotsThree } from '@ng-icons/phosphor-icons/regular';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { classes } from '@spartan-ng/helm/utils';

@Component({
	selector: 'hlm-pagination-ellipsis',
	imports: [HlmIconImports],
	providers: [provideIcons({ phosphorDotsThree })],
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: {
		'data-slot': 'pagination-ellipsis',
	},
	template: `
		<span aria-hidden="true">
			<ng-icon hlm size="sm" name="phosphorDotsThree" />
			<span class="sr-only">{{ srOnlyText() }}</span>
		</span>
	`,
})
export class HlmPaginationEllipsis {
	constructor() {
		classes(() => 'flex size-9 items-center justify-center');
	}

	/** Screen reader only text for the ellipsis */
	public readonly srOnlyText = input<string>('More pages');
}
