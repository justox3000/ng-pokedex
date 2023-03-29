import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
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
  filteredPokemons: any[] = [];
  searchInput: string = '';


  constructor(
    private pokedexService: PokedexService,
    private caughtPokemonService: CaughtPokemonService,
    ) { }

  get pokemons(): any {
    return this.pokedexService.pokemons;
  }

  get searchPokemons(): any {
    return this.filteredPokemons;

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

  filterPokemons() {
    this.filteredPokemons = this.pokedexService.pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(this.searchInput.toLowerCase()));
  }

}
