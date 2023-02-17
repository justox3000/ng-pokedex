import { Component, OnDestroy, OnInit } from '@angular/core';
import { concat, Subscription } from 'rxjs';
import { CaughtPokemonService } from 'src/app/services/caught-pokemon.service';
import { PokedexService } from '../../services/pokedex.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  loading: boolean = false;
  subscriptions: Subscription[] = [];

  constructor(
    private pokedexService: PokedexService,
    private caughtPokemonService: CaughtPokemonService,
    ) { }

  get pokemons(): any {
    return this.pokedexService.pokemons;
  }

  set subscription(subscription: Subscription) {
    this.subscriptions.push(subscription);
  }

  ngOnInit(): void {
    if (!this.pokemons.length) {
      this.loadMore();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription ? subscription.unsubscribe() : 0);
  }

  loadMore(): void {
    this.loading = true;
    this.subscription = this.pokedexService.getNext().subscribe((response: any) => {
      this.pokedexService.next = response.next;
      const details = response.results.map((i: any) => this.pokedexService.get(i.name));
      this.subscription = concat (...details).subscribe((pokemon: any) => {
        this.pokedexService.pokemons.push(pokemon);
      });
    }, error => console.log('Error Occured:', error), () => this.loading = false);
  }

  getType(pokemon: any): string {
    return this.pokedexService.getType(pokemon);
  }

}
